import speech_recognition as sr 
import pyttsx3 

#pip install speechrecognition
#pip install pipwin
#pipwin install pynacl
#pip install --upgrade google-cloud-speech <- google ftw

def main():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Talk for 5 seconds!")
        audio_data = r.record(source, duration = 5)
        print("Recognizing...")
        text = r.recognize_google(audio_data, language="es-Es")
        print(text)
    #except Exception as e:
        #print("error: " + str(e))
        

main()
