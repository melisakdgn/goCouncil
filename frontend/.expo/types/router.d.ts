/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/accessibility` | `/achievements` | `/candidates` | `/contact` | `/data-protection` | `/election-process` | `/faq` | `/imprint` | `/preference-matching` | `/problems` | `/wahl-o-mat`;
      DynamicRoutes: `/candidates/${Router.SingleRoutePart<T>}` | `/preference-matching/results/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/candidates/[id]` | `/preference-matching/results/[sessionId]`;
    }
  }
}
