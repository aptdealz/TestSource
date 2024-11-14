import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileNameExtractor'
})
export class FileNameExtractorPipe implements PipeTransform {
  transform(value: string): string {
    // Split the URL by "/"
    const parts = value.split("/");

    // Get the last part of the split array, which should be the file name
    const fileName = parts[parts.length - 1];

    return fileName;
  }
}