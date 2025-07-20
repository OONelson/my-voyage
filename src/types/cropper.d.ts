declare module "vue-advanced-cropper" {
  export interface CropperResult {
    canvas: HTMLCanvasElement;
    coordinates: {
      width: number;
      height: number;
      left: number;
      top: number;
    };
  }
}
