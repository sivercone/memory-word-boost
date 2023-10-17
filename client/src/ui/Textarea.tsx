import React from 'react';

/**
 * plain logic source https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
 * The Textarea component provides an auto-resizable textarea element.
 * It uses a combination of an internal ref for managing auto-resizing behavior
 * and allows for an external ref to be passed in for external access to the textarea DOM element.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, forwardedRef) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Merge internal ref and forwarded ref
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  React.useImperativeHandle(forwardedRef, () => textareaRef.current!);

  React.useEffect(() => {
    const handleInput = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height to auto before calculating the scroll height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    if (textareaRef.current) {
      textareaRef.current.addEventListener('input', handleInput);
      // Trigger handleInput on component mount to account for default value
      handleInput();
    }

    // Cleanup function to remove the event listener when the component is unmounted
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('input', handleInput);
      }
    };
  }, []);

  return <textarea {...props} ref={textareaRef} className={`resize-none overflow-hidden ${props.className}`} />;
});

export default Textarea;
