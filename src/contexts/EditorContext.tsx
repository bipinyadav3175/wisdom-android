import React, {createContext, ReactNode, useState} from 'react';
import type {EditorContentType} from '../components/Editor';

type EditorContextType = {
  state: EditorContentType | null;
  update: ((data: EditorContentType, title: string) => void) | (() => void);
  clear: () => void;
  title: string | null;
};

const EditorContext = createContext<EditorContextType>({
  state: null,
  update: () => {},
  clear: () => {},
  title: null,
});

const EditorProvider = ({children}: {children: ReactNode}) => {
  const [data, setData] = useState<EditorContentType | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const update = (data: EditorContentType, title: string) => {
    setData(data);
    setTitle(title);
  };

  const clear = () => {
    setData(null);
    setTitle(null);
  };

  return (
    <EditorContext.Provider value={{state: data, update, clear, title}}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
export {EditorProvider};
