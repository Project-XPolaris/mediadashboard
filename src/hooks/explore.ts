import {useEffect, useState} from "react";

export type File = {
  type: string;
  name: string;
  path: string;
}
export type Directory = {
  backPath: string;
  files: File[];
  path: string;
  sep: string;
}
const useExplore = (
  {
    onReadDir
  }: {
    onReadDir: (path: string) => Promise<Directory | undefined>
  }) => {
  const [currentPath, setCurrentPath] = useState("/");
  const [dirInfo, setDirInfo] = useState<Directory | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const load = async (path: string) => {
    setIsLoading(true);
    const res = await onReadDir(path);
    if (res) {
      setIsLoading(false);
      setDirInfo(res);
    }

  };
  const goBack = () => {
    if (!dirInfo) {
      return;
    }
    const {backPath} = dirInfo;
    load(backPath);
    setCurrentPath(backPath);
  };
  useEffect(() => {
    load(currentPath);
  }, []);
  const navigate = (path: string) => {
    load(path);
    setCurrentPath(path);
  };
  const getItems = (): File[] => {
    return dirInfo?.files ?? [];
  };
  const getDirectoryList = (): File[] => {
    return dirInfo?.files.filter(item => item.type === "Directory") ?? [];
  };
  return {
    currentPath, goBack, getItems, setCurrentPath, navigate, getDirectoryList, isLoading
  };
};
export default useExplore;
