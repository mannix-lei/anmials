import { FormEvent, useState } from 'react';
import styles from './index.module.css';

export default function Home() {
    const [animalInput, setAnimalInput] = useState('');
    const [result, setResult] = useState();
    const [imageName, setImageName] = useState('');
    const [imageCount, setImageCount] = useState<number>(1);
    const [imgList, setImgList] = useState<{ url: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        try {
            if (!animalInput) {
                setErrMsg('please input something... baby');
                setTimeout(() => {
                    setErrMsg('');
                }, 2000);
                return;
            }
            setLoading(true);
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ animal: animalInput }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }
            setResult(data.result);
            setAnimalInput('');
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    async function initImg(event: FormEvent) {
        event.preventDefault();
        try {
            if (!imageName) {
                setErrMsg('please input something... baby');
                setTimeout(() => {
                    setErrMsg('');
                }, 2000);
                return;
            }
            setLoading(true);
            const response = await fetch('/api/imgenerate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageName,
                    count: imageCount,
                    size: '1024x1024',
                }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setImgList(data.result);
            setImageName('');
            setImageCount(2);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <div>
            <main className={styles.main}>
                <img src='/dog.png' className={styles.icon} />
                <h3>Name my pet</h3>
                <form onSubmit={onSubmit}>
                    <input
                        type='text'
                        name='animal'
                        placeholder='Enter an animal'
                        value={animalInput}
                        onChange={(e) => setAnimalInput(e.target.value)}
                    />
                    {errMsg && <p className={styles.errMsg}>{errMsg}</p>}
                    <input type='submit' value='Generate names' disabled={loading} />
                </form>
                <div className={styles.result}>{result}</div>
            </main>

            <main className={styles.main}>
                <h3>Get images you like</h3>
                <form onSubmit={initImg}>
                    <input
                        type='text'
                        name='image'
                        placeholder='Enter an name'
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='please input count'
                        name='imageCount'
                        value={imageCount}
                        onChange={(e) => {
                            if (Number(e.target.value) > 20) {
                                alert('please, it is too much');
                            }
                            setImageCount(+e.target.value);
                        }}
                    />
                    {errMsg && <p className={styles.errMsg}>{errMsg}</p>}
                    <input type='submit' value='Generate images' disabled={loading} />
                </form>
                {imgList.length > 0 ? (
                    <div className={styles.imgResult}>
                        {imgList.map((item, index) => (
                            <img key={index} src={item.url} />
                        ))}
                    </div>
                ) : (
                    <div>images will be here...</div>
                )}
            </main>
        </div>
    );
}
