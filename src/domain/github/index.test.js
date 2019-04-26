const nock = require('nock')
const github = require('./index')

describe('Github', () => {

    test('Get URL', () => {
        expect(github.url('expressjs', 'express'))
            .toBe('https://api.github.com/repos/expressjs/express')
    })

    test('API call to get downloads', async () => {
        const response = await github.api('expressjs', 'express')
        expect(response.stargazers_count).toBe(43510)
        expect(response.forks_count).toBe(7365)
        expect(response.open_issues_count).toBe(170)
    })
})

nock(`https://api.github.com`)
  .get(`/repos/expressjs/express`)
  .reply(200, {
    "id": 237159,
    "node_id": "MDEwOlJlcG9zaXRvcnkyMzcxNTk=",
    "name": "express",
    "full_name": "expressjs/express",
    "private": false,
    "owner": {
        "login": "expressjs",
        "id": 5658226,
        "node_id": "MDEyOk9yZ2FuaXphdGlvbjU2NTgyMjY=",
        "avatar_url": "https://avatars2.githubusercontent.com/u/5658226?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/expressjs",
        "html_url": "https://github.com/expressjs",
        "followers_url": "https://api.github.com/users/expressjs/followers",
        "following_url": "https://api.github.com/users/expressjs/following{/other_user}",
        "gists_url": "https://api.github.com/users/expressjs/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/expressjs/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/expressjs/subscriptions",
        "organizations_url": "https://api.github.com/users/expressjs/orgs",
        "repos_url": "https://api.github.com/users/expressjs/repos",
        "events_url": "https://api.github.com/users/expressjs/events{/privacy}",
        "received_events_url": "https://api.github.com/users/expressjs/received_events",
        "type": "Organization",
        "site_admin": false
    },
    "html_url": "https://github.com/expressjs/express",
    "description": "Fast, unopinionated, minimalist web framework for node.",
    "fork": false,
    "url": "https://api.github.com/repos/expressjs/express",
    "forks_url": "https://api.github.com/repos/expressjs/express/forks",
    "keys_url": "https://api.github.com/repos/expressjs/express/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/expressjs/express/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/expressjs/express/teams",
    "hooks_url": "https://api.github.com/repos/expressjs/express/hooks",
    "issue_events_url": "https://api.github.com/repos/expressjs/express/issues/events{/number}",
    "events_url": "https://api.github.com/repos/expressjs/express/events",
    "assignees_url": "https://api.github.com/repos/expressjs/express/assignees{/user}",
    "branches_url": "https://api.github.com/repos/expressjs/express/branches{/branch}",
    "tags_url": "https://api.github.com/repos/expressjs/express/tags",
    "blobs_url": "https://api.github.com/repos/expressjs/express/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/expressjs/express/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/expressjs/express/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/expressjs/express/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/expressjs/express/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/expressjs/express/languages",
    "stargazers_url": "https://api.github.com/repos/expressjs/express/stargazers",
    "contributors_url": "https://api.github.com/repos/expressjs/express/contributors",
    "subscribers_url": "https://api.github.com/repos/expressjs/express/subscribers",
    "subscription_url": "https://api.github.com/repos/expressjs/express/subscription",
    "commits_url": "https://api.github.com/repos/expressjs/express/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/expressjs/express/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/expressjs/express/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/expressjs/express/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/expressjs/express/contents/{+path}",
    "compare_url": "https://api.github.com/repos/expressjs/express/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/expressjs/express/merges",
    "archive_url": "https://api.github.com/repos/expressjs/express/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/expressjs/express/downloads",
    "issues_url": "https://api.github.com/repos/expressjs/express/issues{/number}",
    "pulls_url": "https://api.github.com/repos/expressjs/express/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/expressjs/express/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/expressjs/express/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/expressjs/express/labels{/name}",
    "releases_url": "https://api.github.com/repos/expressjs/express/releases{/id}",
    "deployments_url": "https://api.github.com/repos/expressjs/express/deployments",
    "created_at": "2009-06-26T18:56:01Z",
    "updated_at": "2019-04-26T03:42:35Z",
    "pushed_at": "2019-04-26T03:41:18Z",
    "git_url": "git://github.com/expressjs/express.git",
    "ssh_url": "git@github.com:expressjs/express.git",
    "clone_url": "https://github.com/expressjs/express.git",
    "svn_url": "https://github.com/expressjs/express",
    "homepage": "https://expressjs.com",
    "size": 8773,
    "stargazers_count": 43510,
    "watchers_count": 43510,
    "language": "JavaScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 7365,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 170,
    "license": {
        "key": "mit",
        "name": "MIT License",
        "spdx_id": "MIT",
        "url": "https://api.github.com/licenses/mit",
        "node_id": "MDc6TGljZW5zZTEz"
    },
    "forks": 7365,
    "open_issues": 170,
    "watchers": 43510,
    "default_branch": "master",
    "organization": {
        "login": "expressjs",
        "id": 5658226,
        "node_id": "MDEyOk9yZ2FuaXphdGlvbjU2NTgyMjY=",
        "avatar_url": "https://avatars2.githubusercontent.com/u/5658226?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/expressjs",
        "html_url": "https://github.com/expressjs",
        "followers_url": "https://api.github.com/users/expressjs/followers",
        "following_url": "https://api.github.com/users/expressjs/following{/other_user}",
        "gists_url": "https://api.github.com/users/expressjs/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/expressjs/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/expressjs/subscriptions",
        "organizations_url": "https://api.github.com/users/expressjs/orgs",
        "repos_url": "https://api.github.com/users/expressjs/repos",
        "events_url": "https://api.github.com/users/expressjs/events{/privacy}",
        "received_events_url": "https://api.github.com/users/expressjs/received_events",
        "type": "Organization",
        "site_admin": false
    },
    "network_count": 7365,
    "subscribers_count": 1864
})