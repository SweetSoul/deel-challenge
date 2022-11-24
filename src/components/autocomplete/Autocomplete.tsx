import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import User from "../../types/user";
import Loader from "../loading/Loader";
import styles from "./Autocomplete.module.sass";

export default function Autocomplete() {
	/*
	 * 1. Create a state variable called "inputValue" that will be used to store the value of the input field.
	 * 2. Create a state variable called "suggestions" that will be used to store the list of suggestions.
	 * 3. Create a state variable called "showSuggestions" that will be used to determine whether or not to show the suggestions.
	 * 4. Create a state variable called "selectedSuggestion" that will be used to store the index of the selected suggestion.
	 * 5. Create a state variable called "loading" that will be used to determine whether or not to show the loading indicator.
	 * 6. Create a state variable called "error" that will be used to store the error message.
	 * 7. Create a state variable called "debouncedInputValue" that will be used to store the debounced value of the input field.
	 * 8. Render an input with the following attributes:
	 *   - type="text"
	 *  - value={inputValue}
	 * - onChange={handleInputChange}
	 * - onKeyDown={handleKeyDown}
	 * - placeholder="Search for names"
	 * - aria-label="Search for names"
	 * - aria-autocomplete="list"
	 * - aria-controls="suggestions"
	 * - aria-activedescendant={selectedSuggestion !== null ? `suggestion-${selectedSuggestion}` : null}
	 * - aria-expanded={showSuggestions}
	 * - aria-haspopup="listbox"
	 * - aria-owns="suggestions"
	 * - role="combobox"
	 * 9. Render a list of suggestions if showSuggestions is true.
	 * 10. Render a loading indicator if loading is true.
	 * 11. Render an error message if error is not null.
	 * 12. When the user types in the input field, the inputValue state variable should be updated and we should call https://6040127af3abf00017785815.mockapi.io/api/v3/users to fetch all users, after saving all users in the suggestions state variable the app need to show the suggestions filtered by what is the value in the input field.
	 * 13. The app need to highlight the string that matches the value in the input field at the suggestions.
	 *
	 */
	const [inputValue, setInputValue] = useState("");
	const [suggestions, setSuggestions] = useState<User[]>([]);
	const [selectedSuggestion, setSelectedSuggestion] = useState<User>();
	const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(0);
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const debouncedValue = useDebounce<string>(inputValue, 500);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
		setShowSuggestions(true);
		setError(undefined);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown") {
			if (selectedSuggestionIndex < suggestions.length - 1) {
				setSelectedSuggestionIndex(selectedSuggestionIndex + 1);
			}
		} else if (event.key === "ArrowUp") {
			if (selectedSuggestionIndex > 0) {
				setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
			}
		} else if (event.key === "Enter") {
			if (selectedSuggestionIndex !== null) {
				setInputValue(suggestions[selectedSuggestionIndex].name);
				setShowSuggestions(false);
			}
		}
		const suggestionBox = document.getElementById("suggestions");
		// make suggestion box scroll to the specific suggestion
		if (suggestionBox) {
			suggestionBox.scrollTop = selectedSuggestionIndex * 58;
		}
	};

	const handleSuggestionClick = (suggestion: User) => {
		setInputValue(suggestion.name);
		setShowSuggestions(false);
		setSelectedSuggestion(suggestion);
	};

	const handleSearch = useCallback(
		() =>
			fetch("https://6040127af3abf00017785815.mockapi.io/api/v3/users")
				.then((r) => {
					if (r.status === 200) {
						return r.json();
					}
					throw new Error("Something went wrong");
				})
				.then((users: User[]) => {
					setSuggestions(users);
					setLoading(false);
				})
				.catch((error: Error) => {
					setError(error.message);
					setLoading(false);
				}),
		[]
	);

	const filteredUsers = useMemo(() => {
		if (debouncedValue) {
			return suggestions.filter((user) => user.name.toLowerCase().includes(debouncedValue.toLowerCase()));
		}
		return suggestions;
	}, [debouncedValue, suggestions]);

	const highlightText = useCallback(
		(text: string) => {
			const regex = new RegExp(`(${debouncedValue})`, "gi");
			const sanitizedText = text.replace(regex, "<mark>$1</mark>");
			return { __html: sanitizedText };
		},
		[debouncedValue]
	);

	// For production we would not call the API over and over, we would have a check if the data in the state suffices
	// Caching would be a good idea as well
	useEffect(() => {
		if (debouncedValue) {
			setLoading(true);
			handleSearch();
		}
	}, [debouncedValue]);

	return (
		<div className={styles.container}>
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				placeholder="Search for names"
				aria-label="Search for names"
				aria-autocomplete="list"
				aria-controls="suggestions"
				aria-activedescendant={
					selectedSuggestion !== undefined ? `suggestion-${selectedSuggestion}` : undefined
				}
				aria-expanded={showSuggestions}
				aria-haspopup="listbox"
				aria-owns="suggestions"
				role="combobox"
				className={styles.input}
			/>
			{showSuggestions && debouncedValue && (
				<ul id="suggestions" role="listbox" className={styles.suggestions}>
					{filteredUsers.length ? (
						filteredUsers?.map((suggestion, index) => {
							let className;
							if (index === selectedSuggestionIndex) {
								className = styles.suggestionActive;
							}
							return (
								<li
									className={className + " " + styles.suggestion}
									key={suggestion.id}
									id={`suggestion-${index}`}
									role="option"
									aria-selected={index === selectedSuggestionIndex}
									onClick={() => handleSuggestionClick(suggestion)}
								>
									<div className={styles.avatarContainer}>
										<img src={suggestion.avatar} alt={suggestion.name} className={styles.avatar} />
									</div>
									<div className={styles.userInfo}>
										<h4 dangerouslySetInnerHTML={highlightText(suggestion.name)} />
										<p>{suggestion.jobTitle}</p>
									</div>
								</li>
							);
						})
					) : (
						<li className={styles.suggestion}>
							<div className={styles.userInfo}>
								<h4>No results found</h4>
							</div>
						</li>
					)}
				</ul>
			)}
			{loading && <Loader className={styles.loader} color="#ff0000" size={20} />}
			{error && <p>{error}</p>}
		</div>
	);
}
