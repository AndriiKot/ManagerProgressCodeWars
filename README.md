
# Codewars Progress Manager

An **npm package** that automatically synchronizes a [Codewars](https://www.codewars.com) user profile with a GitHub repository.  
It allows developers to **track their Codewars progress directly in GitHub**, without any manual effort.

---

## ⚙️ How It Works

1. **Scheduled Checks via GitHub Actions**  
   A GitHub Actions workflow runs periodically (e.g., daily) to fetch the user profile from the Codewars API (`/api/v1/users/:username`).  
   This detects changes in user stats such as `honor` or completed kata count.

2. **Optimized Change Detection with Hashing**  
   A `_hash` is generated from the profile data using Node's `crypto` module.  
   If the hash matches the previously saved one, no update is performed, saving unnecessary work.

3. **Storing Changes in SQLite**  
   Updated profiles are stored with:
   * current profile data
   * solved kata details
   * last update timestamp  
   SQLite is used as a lightweight embedded database requiring no server setup.

4. **Automatic Kata File Generation**  
   For each new kata, a folder is created with the kata name.  
   Inside, a `README.md` is generated with kata description from the Codewars API (`/code-challenges/:idOrSlug`).

5. **Extracting User Solutions**  
   **Puppeteer** automates logging into Codewars and scrapes the user's solution code for each kata.

6. **GitHub Synchronization**  
   Changes are automatically committed and pushed to the repository, keeping it in sync with Codewars.

7. **Kata Progress Visualization**  
   Generates **interactive charts** using [Vega-Lite](https://vega.github.io/vega-lite/) for visualizing progress by language, rank, or completion date.

---

## 💡 Optional Features (Future)

* Profile caching in `.cache/codewars/` to reduce API requests.
* Configurable update frequency (e.g., every 12 hours).
* Markdown-based progress statistics tables.
* Notifications via GitHub Issues or Telegram when rank changes.

---

## 📦 Project Structure

