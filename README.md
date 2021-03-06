# Pull data about npm modules

## Data Structures

```text
package
    uuid
    id string
    rev string
    name string
    description string
    author (human.uuid)
    distributionLatest string
    latestName string
    latestDescription string
    latestVersion string
    latestAuthor (human.uuid)
    latestDistShasum string
    latestDistTarball string
    latestDeprecated string
    timeModified datetime
    timeCreated datetime
    timeLatest datetime
    repoType string
    repoURL string
    repoGithubOrg string
    repoGithubRepo string
    readme string
    readmeFileName string
    homepage string
    bugs string
    licence string
    created datetime
    updated datetime

human
    uuid
    email string
    name string
    url string
    created datetime
    updated datetime

packageContributors
    uuid
    id (package.uuid)
    version (package.distributionLatest)
    human (human.uuid)
    type string  // contributor/maintainer
    active bool
    created datetime
    updated datetime

packageDependencies
    uuid
    id (package.uuid)
    version (package.distributionLatest)
    name string
    mapped (package.uuid)
    type string  // dep/dev
    active bool
    created datetime
    updated datetime

npmStars
    uuid
    id (package.uuid)
    version (package.distributionLatest)
    user string
    like bool
    active bool
    created datetime
    updated datetime

keywords
    uuid
    id (package.uuid)
    version (package.distributionLatest)
    name string
    active bool
    created datetime
    updated datetime

downloads
    uuid
    id (package.uuid)
    name string
    start datetime
    end datetime
    downloads bigint
    created datetime
    updated datetime

githubStars
    uuid
    id (package.uuid)
    name string
    avatarURL string
    description string
    createdAt datetime
    updatedAt datetime
    pushedAt datetime
    homepage string // url
    size bigint
    stars bigint // stargazers_count
    subscribers bigint // subscribers_count
    forks bigint // forks
    language string
    archived bool
    disabled bool
    openIssueCount bigint
    license string // license.spdx_id
    created datetime
    updated datetime
```

```text
_id <string>
_rev <string>
name <string>
description <string>
dist-tags {
    latest <npm_version.number>
    next <npm_version.number>
    ... <ignore>
}
versions {
    <npm_version.number> { // the version is dist-tag.latest
        name <string>
        description <string>
        version <npm_version.number>
        author <human>
        contributors [<human>]
        dependencies {
            <string> <string> // first string is a package, the second is semver
        }
        optionalDependencies <ignore>
        devDependencies {
            <string> <string> // first string is a package, the second is semver
        }
        bundleDependencies <ignore>
        peerDependencies <ignore>
        keywords [<string>]
        directories <ignore>
        scripts <ignore>
        bin <ignore>
        engines {
            <string> <string> // e.g. "node": ">= 0.2.0"
        }
        _id <string>
        _nodeSupported <bool>
        _npmVersion <string>
        _nodeVersion <string>
        dist <dist>
        deprecated <string>
        _hasShrinkwrap <bool>
    }
    ...
}
maintainers [<human>]
author <human>
time {
    modified <datetime>
    created <datetime>
    <npm_version.number> <datetime> // the version is dist-tag.latest
    ...
}
repository <repository>
users {
    <npm_user.id> <bool>
    ...
}
readme <string>
readmeFilename <string>
homepage <string> // url
keywords [<string>]
contributors [<human>]
bugs <string> // url
licence <string>


human <
    email <string>
    name <string>
    url <string>
>

dist <
    shasum <string>
    tarball <string>
>

repository <
    type <string>
    url <string> // to be split into person and repo e.g git://github.com/npm/npm.git
    github_org <string> // evaluated
    github_repo <string> // evaluated
>

npm_user <
    id <string>
>

npm_version <
    number <string>
>
```

## Get doc count from npm registry and follow couchDb

URL: <https://replicate.npmjs.com>

```javascript
{
    "db_name": "registry",
    "doc_count": 960204,
    "doc_del_count": 133,
    "update_seq": 969357,
    "purge_seq": 0,
    "compact_running": false,
    "disk_size": 8579453156,
    "other": {
        "data_size": 26665676949
    },
    "data_size": 8409272243,
    "sizes": {
        "file": 8579453156,
        "active": 8409272243,
        "external": 26665676949
    },
    "instance_start_time": "1555736406615787",
    "disk_format_version": 6,
    "committed_update_seq": 969357,
    "compacted_seq": 963391,
    "uuid": "b39742d8adc3edcfa3a3540d4437b3be"
}
```

## Get downloads per week from npm

URL: <https://api.npmjs.org/downloads/point/2019-04-15:2019-04-21/jquery,npm,express>

```javascript
{
    "jquery": {
        "downloads": 2276060,
        "package": "jquery",
        "start": "2019-04-15",
        "end": "2019-04-21"
    },
    "npm": {
        "downloads": 1493442,
        "package": "npm",
        "start": "2019-04-15",
        "end": "2019-04-21"
    },
    "express": {
        "downloads": 7197810,
        "package": "express",
        "start": "2019-04-15",
        "end": "2019-04-21"
    }
}
```

## Search for a package in the NPM registry

URL: <https://registry.npmjs.org/-/v1/search?text=poodle-service>

```javascript
{
    "objects": [
        {
            "package": {
                "name": "poodle-service",
                "scope": "unscoped",
                "version": "0.1.3",
                "description": "Abstracts IMAP interactions, such as downloading entire threads; provides transparent caching",
                "date": "2017-03-14T04:03:28.634Z",
                "links": {
                    "npm": "https://www.npmjs.com/package/poodle-service"
                },
                "author": {
                    "name": "Jesse Hallett",
                    "email": "jesse@sitr.us"
                },
                "publisher": {
                    "username": "hallettj",
                    "email": "hallettj@gmail.com"
                },
                "maintainers": [
                    {
                        "username": "hallettj",
                        "email": "hallettj@gmail.com"
                    }
                ]
            },
            "flags": {
                "unstable": true
            },
            "score": {
                "final": 0.05015927329769439,
                "detail": {
                    "quality": 0.12862140718810147,
                    "popularity": 0.03306528897503984,
                    "maintenance": 0
                }
            },
            "searchScore": 100000.05
        },
        {
            "package": {
                "name": "poodle",
                "scope": "unscoped",
                "version": "0.4.0",
                "description": "Transport framework",
                "keywords": [
                    "service",
                    "transport",
                    "api",
                    "ajax",
                    "image loading"
                ],
                "date": "2015-07-10T16:48:33.265Z",
                "links": {
                    "npm": "https://www.npmjs.com/package/poodle",
                    "homepage": "https://github.com/danstocker/poodle",
                    "repository": "https://github.com/danstocker/poodle",
                    "bugs": "https://github.com/danstocker/poodle/issues"
                },
                "author": {
                    "name": "Dan Stocker",
                    "email": "dan@kwaia.com",
                    "username": "danstocker-legacy"
                },
                "publisher": {
                    "username": "danstocker",
                    "email": "dan@kwaia.com"
                },
                "maintainers": [
                    {
                        "username": "danstocker-legacy",
                        "email": "dan@kwaia.com"
                    }
                ]
            },
            "flags": {
                "unstable": true
            },
            "score": {
                "final": 0.39226737037169307,
                "detail": {
                    "quality": 0.6471161476386912,
                    "popularity": 0.05486568675791396,
                    "maintenance": 0.5112272448994739
                }
            },
            "searchScore": 4.2932865e-7
        }
    ],
    "total": 2,
    "time": "Mon Apr 22 2019 02:53:12 GMT+0000 (UTC)"
}
```

## Get stars from github

URL: <https://api.github.com/repos/expressjs/express>

```javascript
{
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
    "updated_at": "2019-04-22T03:01:04Z",
    "pushed_at": "2019-04-21T02:11:20Z",
    "git_url": "git://github.com/expressjs/express.git",
    "ssh_url": "git@github.com:expressjs/express.git",
    "clone_url": "https://github.com/expressjs/express.git",
    "svn_url": "https://github.com/expressjs/express",
    "homepage": "https://expressjs.com",
    "size": 8808,
    "stargazers_count": 43431,
    "watchers_count": 43431,
    "language": "JavaScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 7363,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 169,
    "license": {
        "key": "mit",
        "name": "MIT License",
        "spdx_id": "MIT",
        "url": "https://api.github.com/licenses/mit",
        "node_id": "MDc6TGljZW5zZTEz"
    },
    "forks": 7363,
    "open_issues": 169,
    "watchers": 43431,
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
    "network_count": 7363,
    "subscribers_count": 1864
}
```

## Get details about a package

URL: <http://registry.npmjs.org/express>