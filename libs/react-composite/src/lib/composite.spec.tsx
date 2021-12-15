import { render } from '@testing-library/react';
import { CC, Composite } from './composite';
import { PropsWithChildren, ReactNode } from 'react';

const D1 = () => <div>d1</div>
const D2 = () => <div>d2</div>

type TestLayoutProps = PropsWithChildren<{
  header?: ReactNode,
  footer?: ReactNode,
  title?: string
}>
const TestLayout = ({header, footer, children, title}: TestLayoutProps) => {
  return (
    <>
      {title && <h1>{title}</h1>}
      {header && <header>{header}</header>}
      {children && <main>{children}</main>}
      {footer && <footer>{footer}</footer>}
    </>
  )
}

describe('Composite', () => {

  it('#components can be an object', () => {
    const { container } = render(
      <Composite components={{
        d1: <D1/>,
        d2: <D2/>
      }} />
    );
    expect(container.outerHTML).toBe("<div><div>d1</div><div>d2</div></div>");
  });

  it('#components can be an array', () => {
    const { container } = render(
      <Composite components={[<D1/>, <D2/>]} />
    );
    expect(container.outerHTML).toBe("<div><div>d1</div><div>d2</div></div>");
  });

  it('can use both #components and children', () => {
    const { container } = render(
      <Composite components={{d1: <D1/>, d2: <D2/>}}>
        <D1/><D2/>
      </Composite>
    );
    expect(container.outerHTML).toBe("<div><div>d1</div><div>d2</div><div>d1</div><div>d2</div></div>");
  });

  it('same key/index should error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
    expect(() => render(
      <Composite components={[<D1/>]}>
        <D2/>
      </Composite>
    )).toThrow("Two or more components with '0' key/index.");
    jest.restoreAllMocks()
  });

  it('in strict mode no mapping results in nothing', () => {
    const { container } = render(
      <Composite components={{d1: <D1/>}} strict={true} />
    );
    expect(container.outerHTML).toBe("<div></div>");
  });

  it('can use custom layout', () => {
    const { container } = render(
      <Composite layout={TestLayout}><D1/></Composite>
    );
    expect(container.outerHTML).toBe("<div><main><div>d1</div></main></div>");
  });

  it('can use custom layout props', () => {
    const { container } = render(
      <Composite layout={TestLayout} layoutProps={{title: 'Title'}}><D1/></Composite>
    );
    expect(container.outerHTML).toBe("<div><h1>Title</h1><main><div>d1</div></main></div>");
  });

  it('can map components in different layout slots', () => {
    const { container } = render(
      <Composite layout={TestLayout} mapLayoutProps={{header: ['0'], footer: ['1']}}><D1/><D2/></Composite>
    );
    expect(container.outerHTML).toBe("<div><header><div>d1</div></header><footer><div>d2</div></footer></div>");
  });

  it('can partially map components', () => {
    const { container } = render(
      <Composite layout={TestLayout} mapLayoutProps={{header: ['0']}}><D1/><D2/></Composite>
    );
    expect(container.outerHTML).toBe("<div><header><div>d1</div></header><main><div>d2</div></main></div>");
  });

  it('can use CC alias', () => {
    const { container } = render(
      <CC components={[<D1/>, <D2/>, 123, "test"]} />
    );
    expect(container.outerHTML).toBe("<div><div>d1</div><div>d2</div>123test</div>");
  });

  it('can use item to name components', () => {
    const { container } = render(
      <CC layout={TestLayout} mapLayoutProps={{header: ['d1']}}>
        <CC.Item name="d1"><D1/></CC.Item>
        <CC.Item name="d2">123</CC.Item>
      </CC>
    );
    expect(container.outerHTML).toBe("<div><header><div>d1</div></header><main>123</main></div>");
  });
});
