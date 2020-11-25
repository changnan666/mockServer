declare type Path = {
  path: string;
  description: string;
  code: string;
};

declare type Config = {
  projectName: string;
  id: string;
  paths: Path[];
};
