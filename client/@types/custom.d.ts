declare module "*.module.scss";
declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.svg" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };
}
