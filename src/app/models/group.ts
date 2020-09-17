export interface Group {
  owner: string;
  group_id: string;
  title: string;
  description: string;
  icon_url: string;
  status: boolean;
  access_type: string;
  date_created: string;
  last_updated: string;
  user_access_list: any;
}
