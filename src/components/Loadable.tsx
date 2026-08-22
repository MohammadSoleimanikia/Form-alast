import { Suspense, ComponentType } from "react";
import PageSkeleton from "./PageSkeleton";


function Loadable(
  Component: ComponentType
) {
  return function LoadableComponent(props: any) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

export default Loadable;