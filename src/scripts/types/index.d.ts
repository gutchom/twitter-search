interface UserInfo {
  uid: number
  user_name: string
  display_name: string
  profile_image_url: string
}

interface Window {
  userInfo: UserInfo
}
