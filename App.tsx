import React, { useState, useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import Video from 'react-native-video';  // Certifique-se de que está importando corretamente
import RNFS from 'react-native-fs';

// URL dos vídeos
const video1Url = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
const video2Url = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';

// Nomes dos arquivos
const video1Filename = 'video1.mp4';
const video2Filename = 'video2.mp4';

const VideoPlayer: React.FC = () => {
  // Estados para armazenar os caminhos dos vídeos e estado de carregamento
  const [video1Path, setVideo1Path] = useState<string | null>(null);
  const [video2Path, setVideo2Path] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideo, setCurrentVideo] = useState('video1');
  
  // Defina a referência com o tipo correto
  const videoPlayerRef = useRef<Video>(null);

  // Função para verificar se o arquivo já existe
  const checkFileExists = async (filename: string): Promise<boolean> => {
    const filePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    return RNFS.exists(filePath);
  };

  // Função para realizar o download dos vídeos
  const downloadVideo = async (url: string, filename: string): Promise<string | null> => {
    try {
      const fileExists = await checkFileExists(filename);
      if (fileExists) {
        // Se o arquivo já existe, retorna o caminho existente
        return `${RNFS.DocumentDirectoryPath}/${filename}`;
      }
      const downloadDest = `${RNFS.DocumentDirectoryPath}/${filename}`;
      await RNFS.downloadFile({ fromUrl: url, toFile: downloadDest }).promise;
      return downloadDest;
    } catch (error) {
      console.error('Failed to download video:', error);
      return null;
    }
  };

  // Função chamada quando o vídeo termina
  const handleEnd = () => {
    // Alterna entre os vídeos ao final da reprodução
    setCurrentVideo((prev) => (prev === 'video1' ? 'video2' : 'video1'));
    console.log("outro video")
  };

  // Efeito para fazer o download dos vídeos ao montar o componente
  useEffect(() => {
    const fetchVideos = async () => {
      const video1Path = await downloadVideo(video1Url, video1Filename);
      const video2Path = await downloadVideo(video2Url, video2Filename);

      setVideo1Path(video1Path);
      setVideo2Path(video2Path);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentVideo === 'video1' && video1Path && (
        <Video
          ref={videoPlayerRef}
          source={{ uri: video1Path }}
          style={styles.video}
          repeat={false}
          resizeMode="cover"
          paused={false}
          volume={1.0}
          onEnd={handleEnd}
        />
      )}
      {currentVideo === 'video2' && video2Path && (
        <Video
          ref={videoPlayerRef}
          source={{ uri: video2Path }}
          style={styles.video}
          repeat={false}
          resizeMode="cover"
          paused={false}
          volume={1.0}
          onEnd={handleEnd}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  video: {
    width: '100%',
    height: '100%',
  } as ViewStyle,
});

export default VideoPlayer;
