/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/day-setup`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/schedule` | `/schedule`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/index` | `/index`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/day-setup`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/schedule` | `/schedule`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/index` | `/index`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/day-setup${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/schedule${`?${string}` | `#${string}` | ''}` | `/schedule${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/index${`?${string}` | `#${string}` | ''}` | `/index${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/day-setup`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/schedule` | `/schedule`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/index` | `/index`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
