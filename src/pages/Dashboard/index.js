import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { FiChevronRight, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { GET_REPOSITORY } from '../../graphql/pullrequests-queries';

import { apolloClearCache } from '../../App';

import { Header, PRImg, SubHeader, Title, Form, Error, Repositories } from './style';

import pullRequestSvg from '../../assets/pr.svg';

const Dashboard = () => {
  const [newToken, setNewToken] = useState('');
  const [messageError, setMessageError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [hasToken, setHasToken] = useState(() => {
    const token = localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);

    if(!token) {
      localStorage.removeItem('@PR-MANAGER:repositories');
    }

    return !!token;
  });
  const [repositories, setRepositories] = useState(() => {
    const storageRepositories = localStorage.getItem('@PR-MANAGER:repositories');

    if(storageRepositories) {
      return JSON.parse(storageRepositories);
    }

    return [];
  });
  const [getRepositories, { error, data }] = useLazyQuery(GET_REPOSITORY, {
    variables: { name: '' }
  });

  useEffect(() => {
    if(error) {
      const message = "A requisição há API retornou um erro.";

      if(error.message.includes('status code 401')) {
        setMessageError(`${message} Não foi possível autorizar com o token informado.`)
        clearLocalStorage();
      } else {
        setMessageError(`${message} Error: ${error.message}`)
      }

      clearInputs();
    }
  }, [error]);

  useEffect(() => {
    if(data) {
      setHasToken(true);
      setMessageError('');

      if(data.viewer.repository) {
        setRepositories([...repositories, data.viewer.repository]);
      } else {
        if(newRepo) {
          setMessageError('Nenhum repositório encontrado com este nome');
        }
      }

      clearInputs();
    }
  }, [data]);

  useEffect(() => {
    if(repositories.length > 0) {
      localStorage.setItem(
        '@PR-MANAGER:repositories',
        JSON.stringify(repositories)
      );
    }
  }, [repositories]);

  const handleResetToken = (event) => {
    event.preventDefault();

    apolloClearCache();
    clearLocalStorage();
    clearInputs();
    setMessageError('');
  }

  const handleUseToken = async (event) => {
    event.preventDefault();

    if(!newToken) {
      setMessageError('Coloque o token para autenticar na API do GitHub');
      clearInputs();
      return;
    }

    localStorage.setItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME, newToken);

    getRepositories();
  }

  const handleAddRepository = (event) => {
    event.preventDefault();

    if(!newRepo) {
      setMessageError('Digite o nome do repositório');
      clearInputs();
      return;
    }

    getRepositories({variables: { name: newRepo }});
  }

  const handleResetRepo = (event) => {
    event.preventDefault();

    clearRepo();
    apolloClearCache();
  }

  const clearLocalStorage = () => {
    clearRepo();
    localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);
    setHasToken(false);
  }

  const clearRepo = () => {
    localStorage.removeItem('@PR-MANAGER:repositories');
    setRepositories([]);
  }

  const clearInputs = () => {
    setNewToken('');
    setNewRepo('');
  }

  return (
    <>
      <Header>
        <PRImg>
          <img src={pullRequestSvg}  alt="Pull request SVG"></img>
          <strong>Pull Request Manager</strong>
        </PRImg>

        {hasToken &&
          <a onClick={handleResetToken}>
            <FiLogOut size={20}/>
            Reset Token
          </a>
        }
      </Header>

      <SubHeader>
        <Title>Multi Repo PR Manager</Title>

        {repositories.length > 0 &&
          <a onClick={handleResetRepo}>
            <FiTrash2 size={20}/>
            Reset Repo
          </a>
        }
      </SubHeader>

      <Form hasError={!!messageError} onSubmit={!hasToken ? handleUseToken : handleAddRepository}>
        <input
          value={!hasToken ? newToken : newRepo}
          onChange={e => (!hasToken ? setNewToken(e.target.value) : setNewRepo(e.target.value))}
          placeholder={!hasToken ? 'Informe seu token de acesso' : 'Informe o seu repositório'}
        />
        <button type="submit">{!hasToken ? 'Usar' : 'Pesquisar'}</button>
      </Form>

      {messageError && <Error>{messageError}</Error>}

      <Repositories>
        {repositories &&
          repositories.map(repository => (
            <Link key={repository.id} to={{
              pathname: `/repositories/${repository.name}`,
              state: {
                avatarUrl: repository.owner.avatarUrl
              }
            }}>
              <img src={repository.owner.avatarUrl} alt={repository.owner.login} />

              <div>
                  <strong>{repository.nameWithOwner}</strong>
                  <p>{!!repository.description ? repository.description : "Sem descrição"}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
          )
        )}
      </Repositories>
    </>
  );
}

export default Dashboard;
