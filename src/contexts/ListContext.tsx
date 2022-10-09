import React, {createContext, useState, useEffect} from 'react';

type ContextType = {
  storyId: string | null;
  changeId: (newId: string) => Promise<void> | void;
};

const ListContext = createContext<ContextType>({
  storyId: null,
  changeId: () => {},
});

const ListProvider = ({children}: {children: React.ReactNode}) => {
  const [storyId, setStoryId] = useState('hello');

  const changeId = async (newId: string) => {
    console.log('story id TO BE CHANGED =', newId);

    setStoryId(newId);

    console.log('story id AFTER CHANGING=', storyId);

    // return new Promise((resolve, reject) => {
    //   while (true) {
    //     if (storyId === newId) {
    //       break;
    //     }
    //   }

    //   console.log('story id after the promise', storyId);

    //   resolve(storyId);
    // });
  };

  useEffect(() => {
    console.log('At last the story id changed:', storyId);
  }, [storyId]);

  return (
    <ListContext.Provider value={{changeId: changeId, storyId: storyId}}>
      {children}
    </ListContext.Provider>
  );
};

export default ListContext;
export {ListProvider};
