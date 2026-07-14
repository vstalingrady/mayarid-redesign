/**
 * Case study carousel cards from mayar.id "Studi Kasus" section.
 *
 * Posters: Mayar × Partner brand films (1280×720 B&W aerial lockups)
 * copied from reference/mayar-id/assets → public/specimen/case-studies/
 *
 * Source mapping (reference assets):
 *   hdU9Y2MKiMzDy5bagHI6XY3sws.jpg → DigitalSkola  (YouTube u4IKLdnrFIw)
 *   mGe3XhKTA7nJP5RyvzkT9c5yJlY.jpg → GREENPEACE   (YouTube bUKwfBi-r-w)
 *   7FlrQeSYjsUSSZoBIwjE33I40.jpg   → Pacmann      (YouTube s18uWoAtQRM)
 *   Any0A53d2tkdo1dN5yKDOjg7rzo.jpg → IELTSpresso  (YouTube irKBb8ynHiU)
 */

export type CaseStudy = {
  id: string;
  partner: string;
  poster: string;
  /** Case-study article on mayar.id */
  href: string;
  /** Brand film on YouTube (original homepage carousel source) */
  videoHref: string;
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    id: "digitalskola",
    partner: "DigitalSkola",
    poster: "/specimen/case-studies/digitalskola.jpg",
    href: "https://mayar.id/case-study/digitalskola",
    videoHref: "https://www.youtube.com/watch?v=u4IKLdnrFIw",
  },
  {
    id: "greenpeace",
    partner: "GREENPEACE",
    poster: "/specimen/case-studies/greenpeace.jpg",
    href: "https://mayar.id/case-study/greenpeace",
    videoHref: "https://www.youtube.com/watch?v=bUKwfBi-r-w",
  },
  {
    id: "pacmann",
    partner: "Pacmann",
    poster: "/specimen/case-studies/pacmann.jpg",
    href: "https://mayar.id/case-study/pacmann",
    videoHref: "https://www.youtube.com/watch?v=s18uWoAtQRM",
  },
  {
    id: "ieltspresso",
    partner: "IELTSpresso",
    poster: "/specimen/case-studies/ieltspresso.jpg",
    href: "https://mayar.id/case-study/ieltspresso",
    videoHref: "https://www.youtube.com/watch?v=irKBb8ynHiU",
  },
] as const;
