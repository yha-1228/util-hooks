import React, { ComponentPropsWithRef } from 'react';
import { useConcatRef } from './hooks/use-concat-ref';

const Button = React.forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<'button'>
>((props, outerRef) => {
  const myRef = React.useRef<HTMLButtonElement>();
  const ref = useConcatRef(myRef, outerRef);

  return (
    <div style={{ border: '2px solid red' }}>
      <button onClick={() => myRef.current?.click()}>Button</button>

      <button {...props} ref={ref} />
    </div>
  );
});

Button.displayName = 'Button';

export function App() {
  const button1Ref = React.useRef<HTMLButtonElement>(null);
  const button2Ref = React.useRef<HTMLButtonElement>(null);

  return (
    <div>
      <button
        ref={button1Ref}
        onClick={() => {
          button2Ref.current?.click();
        }}
      >
        Button1
      </button>
      <Button
        ref={button2Ref}
        onClick={() => {
          console.log(`Button2 clicked at ${new Date()}`);
        }}
      >
        Button2
      </Button>
    </div>
  );
}
