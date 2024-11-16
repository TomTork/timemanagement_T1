export interface IPhoto {
  id: number,
  documentId: string,
  name: string,
  alternativeText: string,
  caption: string,
  width: number,
  height: number,
  formats?: IListFormat,
  url: string
}

export interface IListFormat {
  large?: IFormat,
  medium?: IFormat,
  small?: IFormat,
  xsmall?: IFormat
}

export interface IFormat {
  ext: string,
  url: string,
  hash: string,
  mime: string,
  name: string,
  path: string | null,
  size: number,
  width: number,
  height: number,
  sizeInBytes: number
}