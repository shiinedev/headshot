import { api } from "@/lib/api";
import {
  GetHeadshotsResponse,
  StyleInfo,
  UploadPhotoParams,
  UploadPhotoResponse,
} from "@/lib/types/headshot.types";
import { get } from "http";

export const headshotServices = {
  getHeadshotStyles: async (): Promise<StyleInfo[]> => {
    return api.get<StyleInfo[]>("/headshots/styles");
  },
  uploadPhotos: async (
    params: UploadPhotoParams
  ): Promise<UploadPhotoResponse> => {
    const formData = new FormData();
    formData.append("photo", params.photo);
    formData.append("styles", JSON.stringify(params.styles));

    // Add prompt if provided
    if (params.prompt) {
      formData.append("prompt", params.prompt);
    }

    return api.post<UploadPhotoResponse>("/headshots/generate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getHeadshots: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<GetHeadshotsResponse> => {
    return api.get("/headshots", { params });
  },
  deleteHeadshot: async (id: string): Promise<{id:string}> => {
    return api.delete<{id:string}>(`/headshots/${id}`);
  }
};
