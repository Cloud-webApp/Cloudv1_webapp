export default function submissionUrlValidator(submissionUrl) {
    const githubRepoZipUrlRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/archive\/refs\/tags\/[a-zA-Z0-9._-]+\.zip$/;
    return githubRepoZipUrlRegex.test(submissionUrl);
  }