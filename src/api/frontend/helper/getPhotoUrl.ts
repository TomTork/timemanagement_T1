import {IPhoto} from "../../../../types/IPhoto";
import {IExportPhoto} from "../../../../types/IExportPhoto";

export function choicePhotos(photos: IPhoto[]): IExportPhoto[] | null {
  if(!photos || photos.length == 0) return null
  const exportPhotos: IExportPhoto[] = []
  for(const photo of photos){
    exportPhotos.push({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      description: photo.alternativeText,
    })
  }
  return exportPhotos
}