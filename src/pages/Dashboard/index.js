import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Header, PRImg, Title, Form, Error, Repositories } from './style';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';
import { GET_PULLREQUESTS } from '../../graphql/pullrequests-queries';

import pullRequestSvg from '../../assets/pr.svg';

function Dashboard() {
  const [hasToken, setHasToken] = useState(false);
  // const [isLogIn, setIsLogIn] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState(null);
  const [getRepositories, { loading, error, data }] = useLazyQuery(GET_PULLREQUESTS, {
    variables: { name: '' }
  });

  useEffect(() => {
    if(localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME)) {
      setHasToken(true);
    }

    if(error) {
      const message = "A requisição há API retornou um erro.";

      if(error.message.includes('status code 401')) {
        clearLocalStorage();
        setInputError(`${message} Não foi possível autorizar com o token repassado.`)
      } else {
        setInputError(`${message} Error: ${error.message}`)
      }
    }

    if(data) {
      setInputError('');
      // if(data.viewer.login) {
      //   setIsLogIn(true);
      // }
      
      if(data.viewer.repository) {
        setRepositories([...repositories, data.viewer.repository]);
      }
    }
  }, [data, error]);

  const handleResetToken = (event) => {
    event.preventDefault();

    client.resetStore();
    clearLocalStorage();
    clearInputs();
  }

  const handleUseToken = async (event) => {
    event.preventDefault();

    if(!newToken) {
      setInputError('Coloque o token para autenticar na API do GitHub');
      clearInputs();
      return;
    }

    getRepositories();

    addStorage();
    clearInputs();
  }

  const handleAddRepository = (event) => {
    event.preventDefault();

    if(!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      clearInputs();
      return;
    }

    getRepositories({variables: { name: newRepo }});

    clearInputs();
  }

  const addStorage = () => {
    localStorage.setItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME, newToken);
    setHasToken(true);
  }

  const clearLocalStorage = () => {
    localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_PROPERTY_NAME);
    setHasToken(false);
  }

  const clearInputs = () => {
    setNewToken('');
    setNewRepo('');
  }

  if (loading) return <p>Loading ...</p>;

  // if (error) {
  //   const message = "A requisição há API retornou um erro.";

  //   if(error.message.includes('status code 401')) {
  //     clearStorage();
  //     setInputError(`${message} Não foi possível autorizar com o token repassado.`)
  //   } else {
  //     setInputError(`${message} Error: ${error.message}`)
  //   }
  // }

  // if(data) {
  //   if(data.viewer.login) {
  //     setIsLogIn(true);
  //   }
    
  //   if(data.viewer.repository) {
  //     setRepositories()
  //   }
  // }

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

      <Title>Multi Repo PR Manager</Title>

      <Form hasError={!!inputError} onSubmit={!hasToken ? handleUseToken : handleAddRepository}>
        <input
          value={!hasToken ? newToken : newRepo}
          onChange={e => (!hasToken ? setNewToken(e.target.value) : setNewRepo(e.target.value))}
          placeholder={!hasToken ? 'Informe seu token de acesso' : 'Informe o seu repositório'}
        />
        <button type="submit">{!hasToken ? 'Usar' : 'Pesquisar'}</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories && 
          repositories.map(repository => (
            <a key={repository.id} href="teste">
              <img src={repository.owner.avatarUrl} alt={repository.owner.login} />

              <div>
                  <strong>{repository.name}</strong>
                  <p>{!!repository.description ? repository.description : "Sem descrição"}</p>
              </div>

              <FiChevronRight size={20} />
            </a>
          )
        )}
      </Repositories>
    </>
  );
}

export default Dashboard;
