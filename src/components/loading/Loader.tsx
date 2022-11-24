import styles from "./Loader.module.sass";
interface LoaderProps {
	className?: string;
	color?: string;
	size?: number;
}

/**
 * Loader component that renders a spinner svg icon
 * @param {string} className - class name to apply to the svg element
 * @param {string} color - color of the spinner
 * @param {number} size - size of the spinner
 * @returns {JSX.Element} - loading spinner
 */
const Loader = ({ className, color, size }: LoaderProps): JSX.Element => {
	return (
		<svg
			className={className + " " + styles.loader}
			width={size}
			height={size}
			viewBox="0 0 38 38"
			xmlns="http://www.w3.org/2000/svg"
			style={{ borderRightColor: color ?? "currentColor" }}
		>
			<g fill="none" fillRule="evenodd">
				<g transform="translate(1 1)" strokeWidth="2">
					<circle strokeOpacity=".5" cx="18" cy="18" r="18" />
					<path d="M36 18c0-9.94-8.06-18-18-18" />
				</g>
			</g>
		</svg>
	);
};

export default Loader;
