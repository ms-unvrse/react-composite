import React, { Fragment, PropsWithChildren, ReactChild, ReactElement, ReactNode } from 'react';
import { FragmentLayout } from './fragment-layout';
import { Item } from './item';

export type MapLayoutObject = Record<string, string[]>;
// export type MapLayoutObjectFunction = () => MapLayoutObject;

export type LayoutAware = {
  layoutProps?: Record<string, any>,
  layout?: React.ElementType,
}
export type CompositeComponent = ReactNode;
export type CompositeProps = LayoutAware & {
  components?: Record<string, CompositeComponent> | CompositeComponent[],
  mapLayoutProps?: MapLayoutObject,
  strict?: boolean,
  defaultLayoutSlot?: string,
  children?: CompositeComponent | CompositeComponent[]
}

export const Composite = ({
                            layout = FragmentLayout, layoutProps = {},
                            components = {},
                            children,
                            mapLayoutProps = {},
                            strict = false,
                            defaultLayoutSlot = 'children'
                          }: CompositeProps) => {
  const Layout = layout;
  const props = {...layoutProps};

  const componentsToMap = new Map<string, ReactNode>();

  Object.entries(components).forEach(([key, c]) => {
    // const chElement = c as ReactElement;
    // const key = chElement.props.name ?? cKey;
   if (componentsToMap.has(key))
     throw new Error(`Two or more components with '${key}' key/index.`);
   componentsToMap.set(key, c);
  })

  Object.entries(React.Children.toArray(children)).forEach(([idx, ch]) => {
    const chElement = ch as ReactElement;
    const key = chElement.props.name ?? idx;
    // console.log("Child:", idx, key, ch);
    if (componentsToMap.has(key))
      throw new Error(`Two or more components with '${key}' key/index.`);
    componentsToMap.set(key, ch);
  })

  // console.log("ComponentsToMap:", componentsToMap.keys());
  const mapped = new Set();

  Object.entries(mapLayoutProps).forEach(([slot, ccs]) => {
    props[slot] = ccs.map(cc => {
      mapped.add(cc);
      return <Fragment key={cc}>{componentsToMap.get(cc)}</Fragment>;
    })
  })

  if (!strict) {
    componentsToMap.forEach((c, key) => {
      if (!mapped.has(key)) {
        props[defaultLayoutSlot] ||= [];
        props[defaultLayoutSlot].push(<Fragment key={key}>{c}</Fragment>);
      }
    })
  }

  return (
    <Layout {...props} />
  )
}

Composite.Item = Item;

export const CC = Composite;
