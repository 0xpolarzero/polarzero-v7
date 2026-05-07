declare module "@primer/octicons" {
  type Octicon = {
    toSVG: (options?: Record<string, string | number | boolean>) => string;
  };

  const octicons: {
    star: Octicon;
    "repo-forked": Octicon;
  };

  export default octicons;
}
