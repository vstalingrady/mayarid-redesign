"use client";

import {
  AppWindow,
  BookBookmark,
  BookOpen,
  CalendarBlank,
  ChalkboardTeacher,
  Coins,
  Crown,
  FileText,
  GraduationCap,
  Heart,
  Headphones,
  Key,
  Link as LinkIcon,
  Microphone,
  Package,
  TShirt,
  UsersThree,
  VideoCamera,
  type Icon,
  type IconProps,
} from "@phosphor-icons/react";
import type { ProductIconName } from "@/data/productTypes";

const MAP: Record<ProductIconName, Icon> = {
  link: LinkIcon,
  tshirt: TShirt,
  package: Package,
  key: Key,
  graduation: GraduationCap,
  usersThree: UsersThree,
  video: VideoCamera,
  calendar: CalendarBlank,
  heart: Heart,
  book: BookOpen,
  mic: Microphone,
  headphones: Headphones,
  file: FileText,
  comic: BookBookmark,
  crown: Crown,
  appWindow: AppWindow,
  coins: Coins,
  chalkboard: ChalkboardTeacher,
};

export function ProductIcon({
  name,
  ...props
}: { name: ProductIconName } & IconProps) {
  const Comp = MAP[name];
  return <Comp {...props} />;
}
