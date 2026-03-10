export type UserRole = "OWNER"|"MANAGER"|"ADMIN"|"AGENSI"|"KREATOR"|"USER";
export type SupporterTier = "DONATUR"|"VIP"|"VVIP"|null;
export interface User { id:string; username:string; displayName:string; email:string; avatarUrl:string|null; bio:string|null; role:UserRole; supporterTier:SupporterTier; createdAt:string; updatedAt:string; }
export interface Post { id:string; slug:string; title:string; content:string; authorId:string; tags:string[]; published:boolean; createdAt:string; updatedAt:string; }
export interface Event { id:string; slug:string; title:string; startAt:string; endAt:string|null; discordEventId:string|null; createdAt:string; updatedAt:string; }
export type GalleryStatus = "pending"|"approved"|"rejected";
export interface GalleryItem { id:string; imageUrl:string; caption:string|null; tags:string[]; authorId:string; status:GalleryStatus; createdAt:string; updatedAt:string; }
export interface Anime { id:string; slug:string; title:string; synopsis:string|null; coverUrl:string|null; genres:string[]; status:"ongoing"|"completed"|"upcoming"; createdAt:string; updatedAt:string; }
export interface Episode { id:string; animeId:string; number:number; title:string|null; duration:number|null; streamUrl:string|null; createdAt:string; updatedAt:string; }
export type ApiResponse<T> = { data:T; error:null } | { data:null; error:string };
