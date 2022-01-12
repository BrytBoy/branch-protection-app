/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {

  app.on("repository.created", async (context) => {
    console.log("Repo created console.log!")
    required_approvers = 2;
    console.log(context.payload);
    
    const protection_rule = await context.octokit.request("PUT /repos/{owner}/{repo}/branches/{branch}/protection", {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      branch: context.payload.repository.default_branch,
      required_status_checks: {
        strict : true,
        contexts: []
      },
      required_pull_request_reviews: {
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true,
        required_approving_review_count: required_approvers
      },
      restrictions: null,
      enforce_admins: true
    });

    return context.octokit.issues.create({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name, 
      title: "New Branch Protection Rule Created!",
      body: `
      New branch protection rule has been added to:
      - Require status checks to pass
      - Require pull request reviews before merge
      - Require at least ${required_approvers} approvers for pull requests before merge
      - Require code owners reviews before pull request merges
      - Dismiss stale pull request reviews
      `
    });
  });
};
