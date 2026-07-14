"use client";

import {
  Bell,
  BracketsCurly,
  ChartLine,
  ChatCircle,
  Cube,
  CurrencyDollar,
  CursorClick,
  EnvelopeSimple,
  Gauge,
  GitBranch,
  Link as LinkIcon,
  Megaphone,
  Percent,
  Receipt,
  RocketLaunch,
  ShieldCheck,
  Table,
  UserCircle,
  type Icon,
  type IconProps,
} from "@phosphor-icons/react";
import type { FeatureIconName } from "@/data/features";

const MAP: Record<FeatureIconName, Icon> = {
  rocket: RocketLaunch,
  cursorClick: CursorClick,
  cube: Cube,
  chartLine: ChartLine,
  link: LinkIcon,
  currencyDollar: CurrencyDollar,
  receipt: Receipt,
  shieldCheck: ShieldCheck,
  chat: ChatCircle,
  megaphone: Megaphone,
  bell: Bell,
  gitBranch: GitBranch,
  gauge: Gauge,
  userCircle: UserCircle,
  percent: Percent,
  envelope: EnvelopeSimple,
  brackets: BracketsCurly,
  table: Table,
};

export function FeatureIcon({
  name,
  ...props
}: { name: FeatureIconName } & IconProps) {
  const Comp = MAP[name];
  return <Comp {...props} />;
}
