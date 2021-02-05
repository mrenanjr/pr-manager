import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { FiChevronRight, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { GET_REPOSITORY } from '../../graphql/pullrequests-queries';

import { logout } from '../../App';

import { Header, PRImg, SubHeader, Title, Form, Error, Repositories } from './style';

import pullRequestSvg from '../../assets/pr.svg';

const Dashboard = () => {
  const [newToken, setNewToken] = useState('');
  const [messageError, setMessageError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [hasToken, setHasToken] = useState(() => {
    const token = localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);

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
        clearInputs();
      } else {
        setMessageError(`${message} Error: ${error.message}`)
      }
    }

    if(data) {
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
  }, [data, error]);

  useEffect(() => {
    localStorage.setItem(
      '@PR-MANAGER:repositories',
      JSON.stringify(repositories)
    );
  }, [repositories]);

  const handleResetToken = (event) => {
    event.preventDefault();

    logout();
    clearLocalStorage();
    clearInputs();
  }

  const handleUseToken = async (event) => {
    event.preventDefault();

    if(!newToken) {
      setMessageError('Coloque o token para autenticar na API do GitHub');
      clearInputs();
      return;
    }

    getRepositories();

    addTokenStorage();
    clearInputs();
  }

  const handleAddRepository = (event) => {
    event.preventDefault();

    if(!newRepo) {
      setMessageError('Digite o autor/nome do repositório');
      clearInputs();
      return;
    }

    getRepositories({variables: { name: newRepo }});
  }

  const handleResetRepo = (event) => {
    event.preventDefault();

    setRepositories([]);
    localStorage.removeItem('@PR-MANAGER:repositories');
  }

  const addTokenStorage = () => {
    localStorage.setItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME, newToken);
    setHasToken(true);
  }

  const clearLocalStorage = () => {
    localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);
    localStorage.removeItem('@PR-MANAGER:repositories');
    setHasToken(false);
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
            <Link key={repository.id} to={`/repositories/${repository.name}`}>
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
