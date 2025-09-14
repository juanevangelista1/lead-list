import { useEffect } from 'react';

type Event = MouseEvent | TouchEvent;

// A interface foi simplificada para corresponder diretamente à estrutura de uma 'ref' do React.
// Em vez de usar o tipo genérico RefObject, especificamos a propriedade 'current'.
type RefType = {
	current: HTMLElement | null;
};

export function useClickOutside(ref: RefType, handler: (event: Event) => void) {
	useEffect(() => {
		const listener = (event: Event) => {
			const el = ref.current;

			if (!el || el.contains(event.target as Node)) {
				return;
			}

			handler(event);
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
	}, [ref, handler]);
}
