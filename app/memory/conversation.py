history = []

def add_message(role: str, content: str):
    history.append({"role": role, "content": content})

def get_conversation(): 
    return history[-10:]