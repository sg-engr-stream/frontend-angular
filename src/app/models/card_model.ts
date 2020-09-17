export interface Card {
  created_by: string;
  owner: string;
  card_id: string;
  title: string;
  description: string;
  icon_url: string;
  short_url: string;
  redirect_url: string;
  expiry: string;
  status: boolean;
  date_created: string;
  last_updated: string;
  access_type: string;
  user_access_list: any;
}
