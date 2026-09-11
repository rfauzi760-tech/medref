export interface SearchHit {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  group: string;
  badge?: string;
}

export interface SearchGroup {
  label: string;
  key: string;
  hits: SearchHit[];
}
