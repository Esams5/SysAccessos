class AccessAreaConfig {
    private String name;
    private String location;
    private boolean active;

    public Memento save() {
        return new Memento(name, location, active);
    }

    public void restore(Memento m) {
        this.name = m.name();
        this.location = m.location();
        this.active = m.active();
    }

    // getters/setters…
}

record Memento(String name, String location, boolean active) {}

class ConfigHistory {
    private final Deque<Memento> history = new ArrayDeque<>();

    public void backup(AccessAreaConfig config) {
        history.push(config.save());
    }

    public void undo(AccessAreaConfig config) {
        if (!history.isEmpty()) {
            config.restore(history.pop());
        }
    }
}
