import {EditorContentType} from '.';

function formatData(
  text: string,
  markups: {type: string; start: number; end: number}[],
) {
  if (!markups) return [{text, type: null}];

  let preEnd = 0;
  let result: {text: string; type: string | null}[] = [];

  for (let i = 0; i < markups.length; i++) {
    const markup = markups[i];

    if (markup.start < preEnd) {
      const intersection = preEnd - markup.start;
      const preText = result[i - 1].text;
      const newPreValue = preText.slice(0, preText.length + 1 - intersection);

      result[i - 1].text = newPreValue;
      result.push({
        text: text.slice(intersection, markup.end),
        type: markup.type,
      });
    }

    if (markup.start > preEnd) {
      result.push({type: null, text: text.slice(preEnd, markup.start)});
      result.push({
        type: markup.type,
        text: text.slice(markup.start, markup.end),
      });
    } else {
      result.push({
        type: markup.type,
        text: text.slice(markup.start, markup.end),
      });
    }

    if (i + 1 === markups.length) {
      result.push({type: null, text: text.slice(markup.end, text.length)});
    }

    preEnd = markup.end;
  }

  if (markups.length === 0) {
    result.push({type: null, text: text});
  }

  console.log('FORMATTED MARKUP:', result);

  return result;
}

type MarkupData = {
  markupType: string;
  selection: {
    start: number;
    end: number;
  };
  focusedIndex: number;
};

function handleMarkup(
  data: EditorContentType,
  {markupType, selection: {start, end}, focusedIndex}: MarkupData,
) {
  let content = [...data];
  const item = data[focusedIndex];

  if (item.type !== 'P') return content;

  let newMarkup: {type: string; start: number; end: number}[] = [];

  const markupLength = item.markup ? item.markup.length : 0;

  if (markupLength === 0) {
    newMarkup.push({type: markupType, start: start, end: end});
  } else {
    for (let i = 0; i < markupLength; i++) {
      const markup = item.markup[i];

      // if (markup.start == start && markup.end == end) {
      //   null;
      // }
      // abcdH|EL|LOabcd
      if (start >= markup.start && end < markup.end) {
        console.log('1st one');
        let markup1 = {type: markup.type, start: markup.start, end: start + 1};
        let markup2 = {type: markup.type, start: end, end: markup.end};

        if (markup1.start + 1 !== end) {
          newMarkup.push(markup1);
        }
        if (end + 1 !== markup2.end) {
          newMarkup.push(markup2);
        }
      }
      // abcdHE|LLOabc|d
      if (start >= markup.start && end > markup.end) {
        console.log('2st one');
        if (start > markup.end) {
          newMarkup.push({
            type: markup.type,
            start: markup.start,
            end: markup.end,
          });
          newMarkup.push({type: markupType, start: start, end: end});
        } else {
          newMarkup.push({type: markup.type, start: markup.start, end: end});
        }
      }
      // ab|cdHEL|LOabcd
      if (start < markup.start && end <= markup.end) {
        console.log('3st one');
        if (end < markup.start) {
          newMarkup.push({
            type: markupType,
            start: start,
            end: end,
          });

          newMarkup.push({
            type: markup.type,
            start: markup.start,
            end: markup.end,
          });
        } else {
          newMarkup.push({type: markup.type, start: start, end: markup.end});
        }
      }
      // ab|cdHELLOabc|d
      if (start < markup.start && end > markup.end) {
        console.log('4st one');
        newMarkup.push({type: markup.type, start: start, end: end});
      }
      console.log('no one');

      console.log(newMarkup);
    }
  }

  function removeDuplicates(arr: {type: string; start: number; end: number}[]) {
    // Convert the whole array into a string and then compare
    return arr.filter(
      (v, i, a) =>
        a.findIndex(v2 => JSON.stringify(v2) === JSON.stringify(v)) === i,
    );
  }

  newMarkup = removeDuplicates(newMarkup);

  newMarkup.sort((a, b) => a.start - b.start);

  const newItem = {
    type: item.type,
    markup: start === end ? item.markup : newMarkup,
    content: data[focusedIndex].content,
    url: item.url,
    aspectRatio: item.aspectRatio,
    imgType: item.imgType,
    imgName: item.imgName,
  };

  content[focusedIndex] = newItem;
  console.log('HANDLED MARKUP:', content[focusedIndex].markup);
  return content;
}

function refreshMarkup(
  data: EditorContentType,
  {
    selection: {start, end},
    focusedIndex,
    difference,
  }: {
    selection: {
      start: number;
      end: number;
    };
    focusedIndex: number;
    difference: number;
  },
) {
  let content = [...data];
  const item = data[focusedIndex];

  if (item.type !== 'P') return content;
  if (start !== end) return content;
  const cursorPosition = start;
  if (!item.markup) return content;

  let newMarkup = [];

  for (let i = 0; i < item.markup?.length; i++) {
    let markup = item.markup[i];

    if (cursorPosition > markup.start && cursorPosition < markup.end) {
      newMarkup.push({
        type: markup.type,
        start: markup.start,
        end: markup.end + difference,
      });

      continue;
    }

    if (cursorPosition >= markup.end) {
      newMarkup.push(markup);
      continue;
    }

    newMarkup.push({
      type: markup.type,
      start: markup.start + difference,
      end: markup.end + difference,
    });
  }
  console.log(newMarkup);

  const newItem = {
    type: item.type,
    markup: newMarkup,
    content: item.content,
    url: item.url,
    aspectRatio: item.aspectRatio,
    imgType: item.imgType,
    imgName: item.imgName,
  };

  content[focusedIndex] = newItem;

  return content;
}

function handleSection(
  data: EditorContentType,
  {
    sectionType,
    focusedInput,
    selection,
  }: {
    sectionType: 'H1';
    focusedInput: number;
    selection: {start: number; end: number};
  },
) {
  const handlableSections = ['H1'];
  if (!handlableSections.includes(sectionType)) {
    return {data, addedNew: false};
  }

  let addedNew = false;
  let sectionDeleted = false;

  let content = [...data];
  let section = content[focusedInput];

  if (section.type !== sectionType) {
    const cursorPosition = selection.start;

    // if(cursorPosition === 0) {
    //   section.type = sectionType;
    //   section.markup = null;
    // }

    // @ts-ignore
    const lastChar = section.content[section.content?.length - 1];

    if (
      cursorPosition !== 0 &&
      cursorPosition === section.content?.length &&
      lastChar.match(/\n/g)
    ) {
      // @ts-ignore
      section.content = section.content?.slice(0, section.content.length - 1);

      content.splice(focusedInput + 1, 0, {
        aspectRatio: null,
        content: '',
        markup: null,
        type: 'H1',
        url: null,
        imgName: undefined,
        imgType: undefined,
      });
      addedNew = true;
    } else {
      section.type = sectionType;
      section.markup = null;
    }
  } else {
    // To Do --> Join the current and previous P
    if (
      content[focusedInput - 1] &&
      content[focusedInput - 1].type === 'P' &&
      content[focusedInput + 1] &&
      content[focusedInput + 1].type === 'P'
    ) {
      const previous = content[focusedInput - 1];
      const next = content[focusedInput + 1];

      const newContent = previous.content + '\n' + next.content;
      const oldNextMarkup = next.markup ? next.markup : [];
      let newNextMarkup = [];

      for (let i = 0; i < oldNextMarkup.length; i++) {
        const m = oldNextMarkup[i];

        const lengthToBeAdded = (previous.content?.length as number) + 1;
        newNextMarkup.push({
          type: m.type,
          start: m.start + lengthToBeAdded,
          end: m.end + lengthToBeAdded,
        });
      }

      let totalMarkup = previous.markup?.concat(newNextMarkup);
      totalMarkup?.sort((a, b) => a.start - b.start);

      content.splice(focusedInput, 2);
      sectionDeleted = true;
      content[focusedInput - 1] = {
        aspectRatio: null,
        content: newContent,
        markup: totalMarkup as {type: string; start: number; end: number}[],
        type: 'P',
        url: null,
        imgName: undefined,
        imgType: undefined,
      };
    }

    if (
      content[focusedInput - 1] &&
      content[focusedInput - 1].type === 'P' &&
      (content[focusedInput + 1] == undefined ||
        content[focusedInput + 1].type !== 'P')
    ) {
      console.log('CODE REACHED');
      // This code is not running (not reachable)
      content.splice(focusedInput, 1);
      sectionDeleted = true;
    } else {
      section.type = 'P';
      section.markup = [];
    }

    console.log('previous input', content[focusedInput - 1]);
    console.log('after input', content[focusedInput + 1]);
  }

  if (!sectionDeleted) {
    content[focusedInput] = section;
  }
  return {data: content, addedNew};
}

export {formatData, handleMarkup, refreshMarkup, handleSection};
