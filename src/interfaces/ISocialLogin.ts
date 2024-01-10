export enum SocialMediaPlatform {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  APPLE = "APPLE",
}

export interface ISocialLogin {
  social_media_token: string;
  social_media_paltform: SocialMediaPlatform;
  email?: string;
}
