export const errorStrings = {
	noResumeSelectedError: "Please select resume(s) to perform this action",
	blankFieldError: "This field cannot be left blank",
	specialCharactersError: "You have entered one or more invalid special characters",
	folderAlreadyExistsError: "A Folder by this name already exists. Please specify another name.",
	maxCharatersError: (maxLength = 50) => `Please enter upto ${maxLength} characters only`,
	eAppsExportLimitError:
		"You have completely utilized your maximum limit of CV Access. Please check your Account Utilization section for details or request your Super-User to release more quota using Manage Quota interface.",
	technicalIssueError:
		"Due to some technical issue, your request could not be processed. Please try again in a few minutes.",
	invalidFolderNameError: "Please enter a valid folder name.",
	searchNotSavedError: "Search is not saved. Create new Search",
	folderNotSelectedError: "No folder selected. Please select destination folder",
	quotaExhaustedError: "Quota limit exceeded. Please contact your administrator.",
	duplicateSearchError: "A Search Agent by this name already exists, please specify a new name.",
	invalidEmailInputError: "Invalid email, Please check your email Id",
	invalidSenderEmailError: "More than one sender ID is not allowed",
	alertLimitExceeded:
		"Auto search agent limit exceeded. Please remove some to nominate others to get alerts. However, by doing this your search agent will not be deleted.",
	couldNotProcessError: "The request could not be processed successfully. Please try again",
	noRequirementFound: "No Hiring Requirements Found. Reset Filters",
	noResultsFoundAdvSearch: "No results found for this search. Please modify search criteria.",
};
