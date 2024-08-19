import dotenv from 'dotenv';
import { Octokit } from '@octokit/core';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

async function updateOrAddRelease() {
  try {
    if (!process.env.GH_TOKEN) {
      console.error("GH_TOKEN is not set in the environment variables");
      process.exit(1);
    }

    // Validate token and log authenticated user
    try {
      const { data: user } = await octokit.request('GET /user');
      console.log('Authenticated as:', user.login);
    } catch (error) {
      console.error('Failed to authenticate:', error.message);
      return;
    }

    const owner = "niravpatel129";
    const repo = "timebank";
    const tag = "v1.0.37";

    // Get the release
    const { data: release } = await octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
      owner,
      repo,
      tag,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    console.log('Release ID:', release.id);

    // Get existing assets
    const { data: assets } = await octokit.request('GET /repos/{owner}/{repo}/releases/{release_id}/assets', {
      owner,
      repo,
      release_id: release.id,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    // Update or add Windows assets
    const assetNames = [
      "HourBlock-1.0.37-win.zip",
      "HourBlock Setup 1.0.37.exe",
    ];


    for (const assetName of assetNames) {
      const existingAsset = assets.find(asset => asset.name === assetName);
      const filePath = path.join(__dirname, "..", "release", assetName);
      const data = await fs.readFile(filePath);

      if (existingAsset) {
        // Update existing asset
        await octokit.request('PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}', {
          owner,
          repo,
          asset_id: existingAsset.id,
          name: assetName,
          label: assetName,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/octet-stream',
            'Content-Length': data.length
          }
        });

        console.log(`Updated ${assetName}`);
      } else {
        // Add new asset
        await octokit.request('POST /repos/{owner}/{repo}/releases/{release_id}/assets', {
          owner,
          repo,
          release_id: release.id,
          name: assetName,
          label: assetName,
          data: data,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/octet-stream',
            'Content-Length': data.length
          }
        });

        console.log(`Added ${assetName}`);
      }
    }

    console.log("Release assets updated or added successfully");
  } catch (error) {
    console.error("Error updating or adding release:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", JSON.stringify(error.response.data, null, 2));
      console.error("Headers:", JSON.stringify(error.response.headers, null, 2));
    }
  }
}

updateOrAddRelease();