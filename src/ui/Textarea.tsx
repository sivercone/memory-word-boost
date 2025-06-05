import { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Plain logic source https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
 * The Textarea component provides an auto-resizable textarea element.
 * It uses a combination of an internal ref for managing auto-resizing behavior
 * and allows for an external ref to be passed in for external access to the textarea DOM element.
 */
const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, forwardedRef) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Merge internal ref and forwarded ref
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(forwardedRef, () => textareaRef.current!);

    useEffect(() => {
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

    return <textarea ref={textareaRef} className={twMerge('resize-none overflow-hidden', className)} {...props} />;
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
