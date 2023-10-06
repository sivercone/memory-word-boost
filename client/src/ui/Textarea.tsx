import React from 'react';

/**
 * source - https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
 * @param props
 * @returns
 */
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

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
};

export default Textarea;
