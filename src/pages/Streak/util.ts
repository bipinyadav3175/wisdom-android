const yesterdayDate = (date: '') => {
  let year = parseInt(date.split('-')[0]);
  let month = parseInt(date.split('-')[1]);
  let day = parseInt(date.split('-')[2]);

  let doesMonthChange = false;

  if (month === 1 && day === 1) {
    doesMonthChange = true;

    year = year - 1;
    month = 12;
  } else if (day === 1) {
    doesMonthChange = true;
    month = month - 1;
  } else {
    day = day - 1;
  }

  if (doesMonthChange) {
    day = daysInMonth(month, year);
  }

  const monthString = month.toString().padStart(2, '0');
  const dayString = day.toString().padStart(2, '0');

  return year + '-' + monthString + '-' + dayString;
};

const daysInMonth = (monthIndex: number, year: number) => {
  let days = 0;

  // First 7 months
  if (monthIndex <= 7 && monthIndex % 2 !== 0) {
    days = 31;
  }
  if (monthIndex <= 7 && monthIndex % 2 === 0 && monthIndex !== 2) {
    days = 30;
  }
  if (monthIndex === 2) {
    if (year % 4 === 0) {
      days = 29;
    } else {
      days = 28;
    }
  }

  // Rest of the months
  if (monthIndex > 7 && monthIndex % 2 !== 0) {
    days = 30;
  } else {
    days = 31;
  }

  return days;
};

const tommorowDate = (date: '') => {
  let year = parseInt(date.split('-')[0]);
  let month = parseInt(date.split('-')[1]);
  let day = parseInt(date.split('-')[2]);

  const daysInCurrentMonth = daysInMonth(month, year);

  let doesMonthChange = false;

  if (month === 12 && day === daysInCurrentMonth) {
    doesMonthChange = true;

    year = year + 1;
    month = 1;
  } else if (day === daysInCurrentMonth) {
    doesMonthChange = true;
    month = month + 1;
  } else {
    day = day + 1;
  }

  if (doesMonthChange) {
    day = 1;
  }

  const monthString = month.toString().padStart(2, '0');
  const dayString = day.toString().padStart(2, '0');

  return year + '-' + monthString + '-' + dayString;
};

const getTodaysDate = () => {
  const dateObject = new Date();
  const year = dateObject.getUTCFullYear();
  const month = dateObject.getUTCMonth() + 1;
  const date = dateObject.getUTCDate();

  const cleanDate =
    year +
    '-' +
    String(month).padStart(2, '0') +
    '-' +
    String(date).padStart(2, '0');

  return cleanDate;
};

const formatDates = (dateObject: {}) => {
  let dates = Object.keys(dateObject);
  dates.sort((a, b) => {
    const aDate = parseInt(a.split('-')[2]);
    const bDate = parseInt(b.split('-')[2]);

    return aDate - bDate;
  });
  let chunks = [{}];

  // Classify dates into chunks
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];

    if (!dateObject[date].completed) {
      continue;
    }

    const yesterdaysDate = yesterdayDate(date as string);
    if (!dateObject[yesterdaysDate] || !dateObject[yesterdaysDate].completed) {
      let o = {};
      o[date] = dateObject[date];
      chunks.push(o);
    } else {
      chunks[chunks.length - 1][date] = dateObject[date];
    }
  }
  console.log('CHUNKS', chunks);

  const calendar = {};
  let color = [];
  color.fill('#55efc4', 0, -chunks.length);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkDates = Object.keys(chunk);

    for (let x = 0; x < chunkDates.length; x++) {
      const date = chunkDates[x];

      if (!dateObject[date].completed) {
        continue;
      }

      let shouldGreen = true;

      calendar[date] = {
        selected: true,
        color: '#55efc4',
        textColor: 'black',
      };

      const yesterdaysDate = yesterdayDate(date as string);
      const tommorowsDate = tommorowDate(date as string);

      if (
        !dateObject[yesterdaysDate] ||
        !dateObject[yesterdaysDate].completed
      ) {
        calendar[date].startingDay = true;
      }

      if (!dateObject[tommorowsDate] || !dateObject[tommorowsDate].completed) {
        calendar[date].endingDay = true;

        console.log(date);
        console.log(getTodaysDate());

        if (date === getTodaysDate()) {
          color[i] = '#55efc4';
        } else if (tommorowsDate !== getTodaysDate()) {
          shouldGreen = false;
          color[i] = '#ff7675';
        } else {
          color[i] = '#55efc4';
        }
      }

      // calendar[date].color = shouldGreen ? '#55efc4' : '#ff7675';
      // if (shouldGreen) {
      //   color[i] = '#55efc4';
      // } else {
      //   color[i] = '#ff7675';
      // }
    }

    for (let x = 0; x < chunkDates.length; x++) {
      const date = chunkDates[x];

      const chunkColor = color[i];

      calendar[date].color = chunkColor;
    }
  }

  console.log(calendar);

  return calendar;
};

export {formatDates};
