import type { PropsWithChildren } from '@kitajs/html'

export function Snackbar(props: PropsWithChildren) {
  return <div class="snackbar">{props.children}</div>
}
