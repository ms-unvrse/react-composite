import React, { PropsWithChildren } from 'react';

export type ItemProps = PropsWithChildren<{
  name: string
}>
export const Item = ({name, children}: ItemProps) => <>{children}</>;
