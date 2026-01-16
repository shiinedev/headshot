import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { headshotServices } from "../services/headshots/headshots";
import { GetHeadshotsParams, UploadPhotoParams } from "../types/headshot.types";

export const useHeadshotStyles = () => {
  return useQuery({
    queryKey: ["headshot-styles"],
    queryFn: () => headshotServices.getHeadshotStyles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
export const useGetHeadshot = (params:GetHeadshotsParams) =>{
    const result =  useQuery({
        queryKey: ["headshot",params],
        queryFn: () => headshotServices.getHeadshots(params),
        staleTime :10 * 1000, // 10 seconds
        retry:1,
        refetchInterval:(query) =>{
            const data = query.state.data;
             const hasProcessing = data?.headshots?.some((h) => h.status === 'processing')
        return hasProcessing ? 5000 : false; 
           
        }

        
    })  

    return result;
}

export const useUploadPhotos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["upload-headshot-photos"],
    mutationFn: (params: UploadPhotoParams) => headshotServices.uploadPhotos(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["headshot"]});
    },
  });
};






export const useDeleteHeadshot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => headshotServices.deleteHeadshot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["headshot"]});
    },
  });
}