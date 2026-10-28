import type { ViewComponent } from './cv2';

export type TagsId = {
  id: string;
  name: string;
};

export type TagsResponse = {
  tags: Tag[];
  total_count: number;
};

export type Tag = {
  id: string;
  name: string;
  cv2: boolean;

  content: string;
  components: ViewComponent[];
  colour: string;
  spoiler: boolean;

  creator_id: string;
  creator_name: string;
  creator_discrim?: string | null;
  creator_display: string;
  creator_pfp: string;

  modified_by_id: string;
  modified_by_name: string;
  modified_by_discrim?: string | null;
  modified_by_display: string;
  modified_by_pfp: string;
};

export type TagSessionData = {
  submit_key: string;
  expires: string;
  tag: {
    id: string;
    name: string;
    cv2: boolean;
    content: string;
    components: ViewComponent[];
  } | null;
};
