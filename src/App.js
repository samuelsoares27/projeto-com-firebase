import firebase from "./firebaseConnection";
import {useState, useEffect} from 'react'

function App() {

  const [id, setId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  useEffect(() => {

    async function loadPosts() {
      await firebase.firestore().collection('posts')
        .onSnapshot((doc) => {
        
          let meusPost = [];
          doc.forEach((item) => {
            meusPost.push({
              id: item.id,
              titulo: item.data().titulo,
              autor: item.data().autor
            })
          })
          setPosts(meusPost);
        })
    }

    loadPosts();

  }, [])
  
  useEffect(() => {
    
    async function checkLogin() {
      await firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await firebase.firestore().collection('users')
            .doc(user.uid)
            .get().then((snapshot) => {

              setUser(true);
              setUserLogged({
                uid: user.uid,
                email: user.email,
                nome: snapshot.data().nome,
                status: snapshot.data().status
              });
            }).catch((error) => {
              alert('erro fazer login'+ error)
            })

        } else {
          setUser(false);
          setUserLogged({});
        }
      });
    }
    checkLogin();

  }, []);

  async function handleAdd(){
    await firebase.firestore().collection('posts')
      .doc().set({
        autor: autor,
        titulo: titulo
      }).then(() => {
        alert('cadastrado com sucesso');
        setTitulo('');
        setAutor('');
      }).catch((error) => {
        alert("Gerou o erro:" + error);
      });
  }

  async function EditarPost() {
    if (id === '') {
      alert('id vazio');
      return;
    }
    await firebase.firestore().collection('posts')
      .doc(id).update({
        titulo: titulo,
        autor: autor
      }).then(() => {
        alert('alterado com sucesso');
        setId('');  
        setTitulo('');
        setAutor('');
      }).catch((error) => {
        alert("Gerou o erro:" + error);
      });
  }
  async function ExcluirPost(id) {
    await firebase.firestore().collection('posts')
      .doc(id).delete()
      .then(() => {
        alert('excluido sucesso');
      }).catch((error) => {
        alert("Gerou o erro:" + error);
      });
  }

  async function novoUsuario() {
    await firebase.auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
        
        await firebase.firestore().collection('users')
          .doc(value.user.uid).set({
            nome: nome,
            cargo: cargo,
            status: true
          }).then(()=> {
            setNome('');
            setCargo('');
            setEmail('');
            setSenha('');
          }).catch((error) => {
            alert("erro" + error);
          })
        alert('usuario cadastrado com sucesso');

      }).catch((error) => {
        if (error.code === 'autho/weak-password') {
          alert("Senha muito fraca");
        } else if (error.code === 'autho/email-already-in-use') {
          alert("Email já foi utilizado");
        } else {
          alert("Gerou o erro:" + error);
        }
      });
  }

  async function logout() {
    await firebase.auth().signOut();
  }
  async function login() {
    await firebase.auth().signInWithEmailAndPassword(email, senha)
      .then(async (value) => {

         await firebase.firestore().collection('users')
          .doc(value.user.uid)
          .get().then((snapshot) => {

            setUser(true);
            setUserLogged({
              uid: value.user.uid,
              email: value.user.email,
              nome: snapshot.data().nome,
              status: snapshot.data().status
            });
          }).catch((error) => {
            alert('erro fazer login'+ error)
          })
      
      }).catch((error) => {
        alert('erro fazer login'+ error)
      })
  }

/*
  async function buscaPost() {
    await firebase.firestore().collection('posts')
      .doc('123').get()
      .then((snapshot) => {
        setTitulo(snapshot.data().titulo);
        setAutor(snapshot.data().autor);
      }).catch((error) => {
        alert("Gerou o erro:" + error);
      });
  }*/
/*
  async function buscaTodosPost() {
      await firebase.firestore().collection('posts').get()
      .then((snapshot) => {
        let lista = [];
        
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
        });

        console.log(lista);
        setPosts(lista);
        
      }).catch((error) => {
        alert("Gerou o erro:" + error);
      });
  }*/

  return (
    <div>
      React Js + Firebase<br /><br />
      {
        user && (
          <div>
            <h1>bem vindo vc está logado</h1><br />
            <span>{userLogged.uid} - {userLogged.email} - {userLogged.nome} - { userLogged.status ? 'ATIVO' : 'DESATIVADO'}</span><br />
          </div>
        )
      }
      <div>
        <h1>LOGIN</h1>

        <label>Nome</label><br />
        <input type="text" value={nome} onChange={(e) => { setNome(e.target.value) }} /><br />
        <label>Cargo</label><br />
        <input type="text" value={cargo} onChange={(e) => { setCargo(e.target.value) }} /><br />        
        <label>Email</label><br />
        <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} /><br />
        <label>Senha</label><br />
        <input type="password" value={senha} onChange={(e) => {setSenha(e.target.value)}} /><br />
        <button onClick={login}>Login</button>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logout}>Logout</button>
      </div><br/><br/><br/>

      <hr/>
      <div>

        <h1>CRUD BANCO DE DADOS</h1>
        <label>Id: </label><br/>
        <textarea type="text" value={id} onChange={(e) => { setId(e.target.value) }} /><br/>
        
        <label>Titulo: </label><br/>
        <textarea type="text" value={titulo} onChange={(e) => { setTitulo(e.target.value) }} /><br/>
        
        <label>Autor: </label><br/>
        <input type="text" value={autor} onChange={(e) => { setAutor(e.target.value) }} /><br /><br />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={EditarPost}>Editar</button>
      

        <ul>
          {
            posts.map((post) => {
              return (
                <li key={post.id}>
                  <span>titulo: {post.id}</span><br/>
                  <span>titulo: {post.titulo}</span><br/>
                  <span>autor: {post.autor}</span><br/>
                  <button onClick={() => ExcluirPost(post.id)}>Excluir</button><br /><br />
                </li>
              
              )
            })
          }
        </ul>
      </div>
      <hr/>
    </div>
  );
}

export default App;
