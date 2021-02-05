import { useEffect } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiClipboard } from 'react-icons/fi';
import { useQuery } from '@apollo/client';
import { GET_PULLREQUESTS } from '../../graphql/pullrequests-queries';

import { Header, PRImg, RepositoryInfo, PullRequests } from './style';

import pullRequestSvg from '../../assets/pr.svg';
import { useState } from 'react';

const Repository = () => {
  const { params } = useRouteMatch('');

  const [colaborators, setColaborators] = useState(0);
  const [forks, setForks] = useState(0);
  const [issues, setIssues] = useState(0);
  const [pullRequestsCount, setPullRequestsCount] = useState(0);
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');

  const [pullRequests, setPullRequests] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState('');

  const { error, data, refetch } = useQuery(GET_PULLREQUESTS, {
    variables: { name: params.repository, first: 10 }
  });

  useEffect(() => {
    if(data) {
      const repository = data.viewer.repository;
      setColaborators(repository.collaborators.totalCount);
      setIssues(repository.issues.totalCount);
      setDescription(repository.description);
      setAvatar(repository.owner.avatarUrl);
      setForks(repository.forkCount);

      if(repository.pullRequests) {
        setPullRequestsCount(repository.pullRequests.totalCount);
        setHasNextPage(repository.pullRequests.pageInfo.hasNextPage);
        setEndCursor(repository.pullRequests.pageInfo.endCursor);
        setPullRequests(repository.pullRequests.nodes);
      }
    }
  }, [data]);

  const handleCopyLinks = () => {
    const textField = document.createElement('textarea');

    textField.innerHTML = pullRequests.map(pr => pr.url).join('\r\n');
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  return (
    <>
      <Header>
        <PRImg>
          <img src={pullRequestSvg}  alt="Pull request SVG"></img>
          <strong>Pull Request Manager</strong>
        </PRImg>

        <Link to="/dashboard">
          <FiChevronLeft size={20}/>
          Voltar
        </Link>
      </Header>

      <RepositoryInfo>
        <header>
          <img src={avatar} alt="Avatar image"></img>
          <div className="infoContainer">
            <div className="info">
              <strong>{params.repository}</strong>
              <p>{!!description ? description : "Sem descrição"}</p>
            </div>

            {pullRequests &&
              <a onClick={handleCopyLinks}>
                <FiClipboard size={20}/>
                Copy Links
              </a>
            }
          </div>
        </header>

        <ul>
          <li>
            <strong>{colaborators}</strong>
            <span>Colaboradores</span>
          </li>
          <li>
            <strong>{forks}</strong>
            <span>Forks</span>
          </li>
          <li>
            <strong>{issues}</strong>
            <span>Issues abertas</span>
          </li>
          <li>
            <strong>{pullRequestsCount}</strong>
            <span>Pull Request</span>
          </li>
        </ul>
      </RepositoryInfo>

      <PullRequests>
        {pullRequests &&
          pullRequests.map(pullRequest => (
            <a key={pullRequest.id} target="_blank" href={`${pullRequest.url}`}>
              <img src={pullRequestSvg}  alt="Pull request SVG"></img>

              <div>
                  <strong>{pullRequest.title}</strong>
                  <p>{pullRequest.author.login}</p>
                  <p>{pullRequest.state}</p>
                  <strong>{pullRequest.url}</strong>
              </div>

              <FiChevronRight size={20} />
            </a>
          ))
        }
      </PullRequests>
    </>
  );
}

export default Repository;
